import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';

export function UrlDecoder() {

    const [urlInput, setUrlInput] = useState('');
    const [urlOutput, setUrlOutput] = useState('');
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>)

    function onDecodeUrl() {
        try {
            let decodedData = decodeURIComponent(urlInput);
            setUrlOutput(decodedData);
            setStatusText((<Text span color='green'>URL decoded</Text>));
        }
        catch (error) {
            {/* @ts-ignore */}
            setStatusText((<><Text span color='red'>Error decoding URL</Text><br /><Text span>{error.message}</Text></>));
        }
    }

    function onEncodeUrl() {
        try {
            let encodedData = encodeURIComponent(urlInput);
            setUrlOutput(encodedData);
            setStatusText((<Text span color='green'>URL encoded</Text>));
        }
        catch (error) {
            setStatusText((<><Text span color='red'>Error encoding URL</Text><br /><Text span>{JSON.stringify(error)}</Text></>));
        }
    }

    function onCopyToClipboard() {
        navigator.clipboard.writeText(urlOutput);
        setStatusText((<Text span color='green'>Output copied to clipboard</Text>));
    }

    return (
        <Container fluid flex={1} maw={'86%'}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: 'rgb(255, 142, 243)', to: 'rgb(142, 255, 255)' }}>URL Decoder</Text>
            </Title>

            <Textarea
                description='Place URL encoded/decoded data into field below and use buttons to interact'
                autosize
                minRows={10}
                maxRows={20}
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}>
            </Textarea>

            <Space h='md'></Space>

            <SimpleGrid cols={2}>
                <Button color='grape' onClick={onDecodeUrl}>Decode URL</Button>
                <Button color='grape' onClick={onEncodeUrl}>Encode URL</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <Text>Output</Text>
            <Button color='grape' onClick={onCopyToClipboard}>Copy to clipboard</Button>
            <ScrollArea.Autosize mah={300} type='always' offsetScrollbars>
                <CodeHighlight code={urlOutput} language='json' withCopyButton={false}></CodeHighlight>
            </ScrollArea.Autosize>

        </Container>
    );

}