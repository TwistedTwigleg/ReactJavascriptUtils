import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';
import { useMantineTheme } from '@mantine/core';

import {
    IconLock,
    IconLockOpen,
    IconClipboard
} from '@tabler/icons-react';

export function UrlDecoder() {

    const [urlInput, setUrlInput] = useState('');
    const [urlOutput, setUrlOutput] = useState('');
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>);

    const theme = useMantineTheme();

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
        <Container fluid flex={1} maw={'86%'} style={{height: '100vh', width: '100%'}}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}>URL Decoder</Text>
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
                <Button color='grape' onClick={onDecodeUrl}><IconLockOpen/>Decode URL</Button>
                <Button color='grape' onClick={onEncodeUrl}><IconLock/>Encode URL</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Output</Text>
                <ScrollArea.Autosize mah={300} type='always'>
                    <CodeHighlight code={urlOutput} language='json' withCopyButton={false}></CodeHighlight>
                </ScrollArea.Autosize>
            </SimpleGrid>
            <Space h='xs'></Space>
            <SimpleGrid cols={1}>
                <Button color='grape' onClick={onCopyToClipboard} disabled={urlOutput==''}><IconClipboard/>Copy to clipboard</Button>
            </SimpleGrid>

        </Container>
    );

}