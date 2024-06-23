import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';
import { useMantineTheme } from '@mantine/core';

import {
    IconLock,
    IconLockOpen,
    IconClipboard
} from '@tabler/icons-react';

export function Base64Decoder() {

    const [base64Input, setBase64Input] = useState('');
    const [base64Output, setBase64Output] = useState('');
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>)

    const theme = useMantineTheme();

    // Credit: https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
    function b64EncodeUnicode(str : string) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                {/* @ts-ignore */}
                return String.fromCharCode('0x' + p1);
        }));
    }
    function b64DecodeUnicode(str : string) {
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    function onDecodeBase64() {
        try {
            let parsedBase64 = b64DecodeUnicode(base64Input);
            setBase64Output(parsedBase64);
            setStatusText((<Text span color='green'>Base64 decoded</Text>));
        }
        catch (error) {
            {/* @ts-ignore */}
            setStatusText((<><Text span color='red'>Error decoding Base64</Text><br /><Text span>{error.message}</Text></>));
            setBase64Output("");
        }
    }

    function onEncodeBase64() {
        try {
            let parsedBase64 = b64EncodeUnicode(base64Input);
            setBase64Output(parsedBase64);
            setStatusText((<Text span color='green'>Base64 encoded</Text>));
        }
        catch (error) {
            setStatusText((<><Text span color='red'>Error encoding Base64</Text><br /><Text span>{JSON.stringify(error)}</Text></>));
        }
    }

    function onCopyToClipboard() {
        navigator.clipboard.writeText(base64Output);
        setStatusText((<Text span color='green'>Output copied to clipboard</Text>));
    }

    return (
        <Container fluid flex={1} maw={'86%'} style={{height: '100vh', width: '100%'}}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}>Base64 Decoder</Text>
            </Title>

            <Textarea
                description='Place Base64 into field below and use buttons to interact'
                autosize
                minRows={10}
                maxRows={20}
                value={base64Input}
                onChange={e => setBase64Input(e.target.value)}>
            </Textarea>

            <Space h='md'></Space>

            <SimpleGrid cols={2}>
                <Button color='grape' onClick={onDecodeBase64}><IconLockOpen/>Decode Base64</Button>
                <Button color='grape' onClick={onEncodeBase64}><IconLock/>Encode Base64</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Output</Text>
                <ScrollArea.Autosize mah={300} type='always'>
                    <CodeHighlight code={base64Output} language='jsx' withCopyButton={false}></CodeHighlight>
                </ScrollArea.Autosize>
                <Button color='grape' onClick={onCopyToClipboard} disabled={base64Output==''}><IconClipboard/>Copy to clipboard</Button>
            </SimpleGrid>

        </Container>
    );

}