package storage

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
	"github.com/rubenv/sql-migrate"
	"io"
	"os"
	"reflect"
	"runtime"
	"strconv"
	"strings"
	"testing"
	"time"
)

var (
	testStorage       *Storage
	dbUser            = "tester"
	dbUserPassword    = "tester"
	globalDBName      = "filler_test_db"
	postgresPort      = uint16(15432)
	serviceConnString = fmt.Sprintf("postgresql://localhost:%d/template1?user=postgres&sslmode=disable", postgresPort)
)

func TestAll(t *testing.T) {
	var ctx = context.Background()
	cli, containerID, err := startPostgresContainer(ctx)
	if err != nil {
		t.Error(err)
		return
	}

	defer func() {
		tearDownTests(ctx, containerID, cli)
	}()

	if err := setupTestDB(); err != nil {
		t.Error(err)
		return
	}

	if err := setupScheme(globalDBName, dbUser, dbUserPassword, "localhost", postgresPort); err != nil {
		t.Error(err)
		return
	}

	testStorage, err = newTestStorage(globalDBName, dbUser, dbUserPassword, "localhost", postgresPort)
	if err != nil {
		t.Error(err)
		return
	}

	if err := setupData(); err != nil {
		t.Error(err)
		return
	}

	// This wrapper enables us to insert our own recovery logic _before_ Go's
	// testing module recovery (and execute teardown logic).
	wrapper := func(cb func(*testing.T)) func(*testing.T) {
		return func(t *testing.T) {
			defer func() {
				if err := recover(); err != nil {
					tearDownTests(ctx, containerID, cli)
					panic(err)
				}
			}()
			cb(t)
		}
	}

	tests := []func(*testing.T){
		testGetBestBlock,
		testGetUnfilledIntervals,
	}
	for _, test := range tests {
		t.Run(GetFunctionName(test), wrapper(test))
	}
}

func tearDownTests(ctx context.Context, containerID string, cli *client.Client) {
	if testStorage != nil && testStorage.db != nil {
		if err := testStorage.db.Close(); err != nil {
			fmt.Println(err)
		}
	}

	if err := cli.ContainerStop(ctx, containerID, nil); err != nil {
		fmt.Println(err)
	}
	if err := cli.ContainerRemove(ctx, containerID, types.ContainerRemoveOptions{}); err != nil {
		fmt.Println(err)
	}
	if err := cli.Close(); err != nil {
		fmt.Println(err)
	}
}

func startPostgresContainer(ctx context.Context) (cli *client.Client, containerID string, err error) {
	cli, err = client.NewEnvClient()
	if err != nil {
		return nil, "", fmt.Errorf("failed to setup Docker client: %s", err)
	}

	reader, err := cli.ImagePull(ctx, "docker.io/library/postgres", types.ImagePullOptions{})
	if err != nil {
		cli.Close()
		return nil, "", fmt.Errorf("failed to pull postgres image: %s", err)
	}
	io.Copy(os.Stdout, reader)

	containerCfg := &container.Config{
		Image:        "postgres",
		ExposedPorts: nat.PortSet{"5432": struct{}{}},
	}
	hostCfg := &container.HostConfig{
		PortBindings: map[nat.Port][]nat.PortBinding{
			nat.Port("5432"): {{HostIP: "localhost", HostPort: strconv.FormatUint(uint64(postgresPort), 10)}},
		},
	}
	resp, err := cli.ContainerCreate(ctx, containerCfg, hostCfg, nil, globalDBName)
	if err != nil {
		cli.Close()
		return nil, "", fmt.Errorf("failed to create container: %s", err)
	}

	if err := cli.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{}); err != nil {
		cli.Close()
		return nil, "", fmt.Errorf("failed to start container: %s", err)
	}

	return cli, resp.ID, nil
}

func setupTestDB() error {
	db, err := sql.Open("postgres", serviceConnString)
	if err != nil {
		return fmt.Errorf("failed to connect to template1: %s", err)
	}
	defer db.Close()

	if err := checkPostgresReadiness(db); err != nil {
		return fmt.Errorf("postgres not ready: %v", err)
	}

	for _, dbName := range []string{globalDBName} {
		if _, err := db.Exec(fmt.Sprintf("DROP DATABASE IF EXISTS %s", dbName)); err != nil {
			return fmt.Errorf("failed to preliminarily drop database: %s", err)
		}
	}

	if _, err := db.Exec(fmt.Sprintf("DROP USER IF EXISTS %s", dbUser)); err != nil {
		return fmt.Errorf("failed to preliminarily drop user: %s", err)
	}

	if _, err = db.Exec(fmt.Sprintf("CREATE USER %s WITH PASSWORD '%s'", dbUser, dbUserPassword)); err != nil {
		return fmt.Errorf("failed to create user: %v", err)
	}

	for _, dbName := range []string{globalDBName} {
		if _, err := db.Exec(fmt.Sprintf("CREATE DATABASE %s OWNER %s", dbName, dbUser)); err != nil {
			return fmt.Errorf("failed to create database: %s", err)
		}
	}

	return nil
}

func setupScheme(database, user, password, host string, port uint16) error {
	connStr := getConnString(database, user, password, host, port)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("failed to connect to template1: %s", err)
	}
	defer db.Close()

	migrations := &migrate.FileMigrationSource{
		Dir: "../../migrations",
	}

	n, err := migrate.Exec(db, "postgres", migrations, migrate.Up)
	if err != nil {
		return err
	}
	fmt.Printf("Applied %d migrations \r\n", n)
	return nil
}

func setupData() error {
	for i := 1; i <= int(expectedBestBlock); i++ {
		_, err := testStorage.db.Exec(insertBlockQuery, i, string(i), "", 0, "", "", "", "", "", "", 0, 0, 0, "", 0, 0, 0, "", 0)
		if err != nil {
			return err
		}
	}
	return nil
}

func checkPostgresReadiness(db *sql.DB) error {
	var err error
	for numRetries := 10; numRetries > 0; numRetries-- {
		if _, err := db.Exec("CREATE DATABASE is_ready"); err == nil {
			return nil
		}
		fmt.Printf("postgres container not ready, %d retries left\n", numRetries)
		time.Sleep(time.Second)
	}

	return fmt.Errorf("failed to connect to postgres container: %v", err)
}

func newTestStorage(dbName, user, password, host string, port uint16) (*Storage, error) {
	cfg := &Config{
		User:     user,
		Password: password,
		Database: dbName,
		Port:     port,
		Host:     host,
	}

	s, err := NewStorage(cfg)
	if err != nil {
		return nil, err
	}
	return s, nil
}

func GetFunctionName(i interface{}) string {
	split := strings.Split(runtime.FuncForPC(reflect.ValueOf(i).Pointer()).Name(), ".")
	return split[len(split)-1]
}
