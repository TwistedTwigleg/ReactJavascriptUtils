import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space, Stack } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';
import { useMantineTheme } from '@mantine/core';

import {
    IconLockOpen,
    IconClipboard
} from '@tabler/icons-react';

export function JWTViewer() {

    const [jwtTokenInput, setJWTTokenInput] = useState('');
    const [jwtTokenOutputHeader, setJWTTokenOutputHeader] = useState('');
    const [jwtTokenOutputData, setJWTTokenOutputData] = useState('');
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>);

    const theme = useMantineTheme();

    // Credit: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
    function decodeJWTJSON(str : string) {
        try {
            let base64Url = str.split('.');
            let headerJSON = base64Url[0];
            let dataJSON = base64Url[1];

            headerJSON = headerJSON.replace(/-/g, '+').replace(/_/g, '/');            
            dataJSON = dataJSON.replace(/-/g, '+').replace(/_/g, '/');

            let headerJSONFinal = "";
            let dataJSONFinal = "";

            try {
                headerJSONFinal = decodeURIComponent(window.atob(headerJSON                                                                                                               ).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                headerJSONFinal = JSON.parse(headerJSONFinal);
            } catch (error) {
                console.log("ERROR parsing JWT Header: ", error)
            }

            try {
                dataJSONFinal = decodeURIComponent(window.atob(dataJSON                                                                                                               ).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                dataJSONFinal = JSON.parse(dataJSONFinal);
            } catch (error) {
                console.log("ERROR parsing JWT Header: ", error)
            }

            return {"header": headerJSONFinal, "data": dataJSONFinal};
        }
        catch(error) {
            console.log("ERROR trying to decode JWT: ", error);
            return {"header": "", "data": ""}
        }
    }

    function decodeJWT() {
        let decodedJSON = decodeJWTJSON(jwtTokenInput);
        let hasHeader = false;
        let hasData = false;

        if (decodedJSON['header'] !== "") {
            setJWTTokenOutputHeader(JSON.stringify(decodedJSON['header'], undefined, "  "));
            hasHeader = true;
        } else {
            setJWTTokenOutputHeader(`ERROR: header could not be parsed!`);
        }

        if (decodedJSON['data'] !== "") {
            setJWTTokenOutputData(JSON.stringify(decodedJSON['data'], undefined, "  "));
            hasData = true;
        } else {
            setJWTTokenOutputData(`ERROR: data could not be parsed!`);
        }

        if (hasData && hasHeader) {
            setStatusText((<Text span color='green'>JWT Token decoded</Text>));
        }
        else if (hasHeader) {
            setStatusText((<Text span color='yellow'>JWT Token header decoded, but data was not</Text>));
        }
        else if (hasData) {
            setStatusText((<Text span color='yellow'>JWT Token data decoded, but header was not</Text>));
        }
        else {
            setStatusText((<Text span color='red'>JWT Token could not be decoded</Text>));
        }
    }

    function onCopyToClipboardHeader() {
        navigator.clipboard.writeText(jwtTokenOutputHeader);
        setStatusText((<Text span color='green'>JWT header copied to clipboard</Text>));
    }
    function onCopyToClipboardData() {
        navigator.clipboard.writeText(jwtTokenOutputData);
        setStatusText((<Text span color='green'>JWT data copied to clipboard</Text>));
    }

    return (
        <Container fluid flex={1} maw={'86%'} style={{height: '100vh', width: '100%'}}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}>JWT Viewer</Text>
            </Title>
            <Text><b>Note:</b> Does <Text color={theme.colors.grape[5]} span>not verify the signature</Text> of the JWT.</Text>

            <Textarea
                description='Place JWT Token into field below and use buttons to interact'
                autosize
                minRows={10}
                maxRows={20}
                value={jwtTokenInput}
                onChange={e => setJWTTokenInput(e.target.value)}>
            </Textarea>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Button color='grape' onClick={decodeJWT}><IconLockOpen/>Parse JWT</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <Stack>
                <SimpleGrid cols={2}>
                    <Text>Decoded JWT Header</Text>
                    <Text>Decoded JWT Data</Text>
                </SimpleGrid>
                <SimpleGrid cols={2}>
                    <ScrollArea.Autosize mah={300} type='always'>
                        <CodeHighlight code={jwtTokenOutputHeader} language='jsx' withCopyButton={false}></CodeHighlight>
                    </ScrollArea.Autosize>
                    <ScrollArea.Autosize mah={300} type='always'>
                        <CodeHighlight code={jwtTokenOutputData} language='jsx' withCopyButton={false}></CodeHighlight>
                    </ScrollArea.Autosize>
                </SimpleGrid>
                <SimpleGrid cols={2}>
                    <Button color='grape' onClick={onCopyToClipboardHeader} disabled={jwtTokenOutputHeader==''}><IconClipboard/>Copy to clipboard</Button>
                    <Button color='grape' onClick={onCopyToClipboardData} disabled={jwtTokenOutputData==''}><IconClipboard/>Copy to clipboard</Button>
                </SimpleGrid>
            </Stack>

        </Container>
    );

}