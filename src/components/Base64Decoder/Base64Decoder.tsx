import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';

export function Base64Decoder() {

    const [base64Input, setBase64Input] = useState('');
    const [base64Output, setBase64Output] = useState('');
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>)

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
        <Container fluid flex={1} maw={'86%'}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: 'rgb(255, 142, 243)', to: 'rgb(142, 255, 255)' }}>Base64 Decoder</Text>
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
                <Button color='grape' onClick={onDecodeBase64}>Decode Base64</Button>
                <Button color='grape' onClick={onEncodeBase64}>Encode Base64</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <Text>Output</Text>
            <Button color='grape' onClick={onCopyToClipboard}>Copy to clipboard</Button>
            <ScrollArea.Autosize mah={300} type='always' offsetScrollbars>
                <CodeHighlight code={base64Output} language='jsx' withCopyButton={false}></CodeHighlight>
            </ScrollArea.Autosize>

        </Container>
    );

}