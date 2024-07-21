import { Title, Text, Button, SimpleGrid, Container, Space, NumberInput, Stack, Center, Indicator } from '@mantine/core';
import { useState } from 'react';
import { useMantineTheme } from '@mantine/core';
import { DateTimePicker, Calendar, TimeInput, DatePickerInputProps } from '@mantine/dates';

import {
    IconLock,
    IconLockOpen,
    IconClipboard,
    IconClock
} from '@tabler/icons-react';

export function EpochDecoder() {

    const [dateTime, setDateTime] = useState(new Date());
    const theme = useMantineTheme();

    function onCopyToClipboard() {
        navigator.clipboard.writeText(dateTime.getTime().toString());
    }
    function onGetCurrentTime() {
        setDateTime(new Date(Date.now()));
    }
    function getValueWithZero(value: number) {
        if (value < 10) {
            return `0${value}`;
        }
        return `${value}`
    }
    function getTimeString(date: Date) {
        return getValueWithZero(dateTime.getHours()) + ":" + getValueWithZero(dateTime.getMinutes()) + ":" + getValueWithZero(dateTime.getSeconds());
    }

    const getYearControlProps: DatePickerInputProps['getYearControlProps'] = (date) => {
        if (date.getFullYear() === dateTime.getFullYear()) {
            return {
                style: {
                    color: theme.colors.pink[3],
                    fontWeight: 700,
                },
            };
        }
        else {
            return {disabled: true}
        }
    };
    const getMonthControlProps: DatePickerInputProps['getMonthControlProps'] = (date) => {
        if (date.getMonth() === dateTime.getMonth()) {
            return {
                style: {
                    color: theme.colors.pink[3],
                    fontWeight: 700,
                },
            };
        }
        else {
            return { disabled: true };
        }
    };
    function calendarRenderDay(date : Date) {
        const day = date.getDate();
        if (date.getFullYear() === dateTime.getFullYear() && date.getMonth() === dateTime.getMonth() && date.getDate() === dateTime.getDate()) {
            return (
                <Indicator size={12} color={theme.colors.pink[3]} offset={-4}>
                    <div style={{color: 'var(--mantine-color-grape-5)'}}>{day}</div>
                </Indicator>
            );
        }
        else {
            return (
                <Indicator size={12} color={theme.colors.pink[3]} offset={-4} disabled={
                    (date.getDate() !== dateTime.getDate()) ||
                    (date.getMonth() !== dateTime.getMonth()) ||
                    (date.getFullYear() !== dateTime.getFullYear())
                }>
                    <div style={{color: 'var(--mantine-color-gray-5)'}}>{day}</div>
                </Indicator>
            );
        }
    }

    function onNumberInputTimeChange(value : number | string) {
        try {
            let newDate = new Date(value)
            if (newDate.getFullYear() > 0) {
                setDateTime(new Date(value))
            }   
        }
        catch(error) { /* Nothing to do here */}
    }

    return (
        <Container fluid flex={1} maw={'100%'} style={{ height: '100vh', width: '100%' }}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}>Epoch Decoder</Text>
            </Title>

            <SimpleGrid cols={2}>
                <DateTimePicker label="Select Time from UI" placeholder="Pick date and time" value={dateTime} onChange={(value) => setDateTime(new Date(value?.getTime() || 0))} />
                <NumberInput label="Select Time from Number" placeholder='Pick Time from Number' value={dateTime.getTime()} onChange={onNumberInputTimeChange} />
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={2}>
                <Button color='grape' onClick={onGetCurrentTime}><IconClock />Get Current Time</Button>
                <Button color='grape' onClick={onCopyToClipboard}><IconClipboard />Copy Epoch Time to clipboard</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <Text>Output</Text>

            <Stack>
                <SimpleGrid cols={2}>
                    <Center>
                        <Calendar
                            static
                            defaultDate={dateTime}
                            date={dateTime}
                            size='lg'
                            defaultLevel='month'
                            getYearControlProps={getYearControlProps}
                            getMonthControlProps={getMonthControlProps}
                            renderDay={calendarRenderDay}
                        />
                    </Center>
                    <Center>
                        <Stack flex={1}>
                            <TimeInput withSeconds flex={1} readOnly={true} value={getTimeString(dateTime)} label="Time:"></TimeInput>
                        </Stack>
                    </Center>
                </SimpleGrid>
            </Stack>

        </Container>
    );

}