package storage

import "fmt"

func getConnString(database, user, password, host string, port uint16) string {
	return fmt.Sprintf("postgresql://%s:%d/%s?user=%s&password=%s&sslmode=disable", host, port, database, user, password)
}
