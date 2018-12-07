    <DatepickerDropdown 
        value={new Date(2020, 0, 20)}
        targetDate={new Date(2020, 0, 7)}
        disableBefore={new Date(2020, 0, 7)}
        name="1"
        onChange={e => console.log(JSON.stringify(e))}
    />
