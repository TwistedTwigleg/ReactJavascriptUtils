import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';
import { useMantineTheme } from '@mantine/core';

import {
    IconCheck,
    IconNotebook,
    IconWeight,
    IconClipboard
} from '@tabler/icons-react';

export function JsonLinter() {

    const [jsonLintInput, setJsonLintInput] = useState('');
    const [jsonLintOutput, setJsonLintOutput] = useState('');
    
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>)

    const theme = useMantineTheme();

    function onParseJSON() {
        try {
            JSON.parse(jsonLintInput);
            setStatusText((<Text span color='green'>JSON is valid</Text>));
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.log(error);
                setStatusText((<><Text span color='red'>JSON is invalid</Text><br /><Text span>{error.toString()}</Text></>));
            }
            else {
                setStatusText((<><Text span color='red'>JSON is invalid</Text><br /><Text span>{JSON.stringify(error)}</Text></>));
            }
        }
    }

    async function onPrettyJSON() {
        try {
            let parsedJSON = JSON.parse(jsonLintInput);
            setJsonLintOutput(JSON.stringify(parsedJSON, undefined, "  "))
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.log(error);
                setStatusText((<><Text span color='red'>JSON is invalid</Text><br /><Text span>{error.toString()}</Text></>));
                setJsonLintOutput("");
            }
            else {
                {/* @ts-ignore */}
                setStatusText((<><Text span color='red'>JSON is invalid</Text><br /><Text span>{error.message}</Text></>));
                setJsonLintOutput("");
            }
        }
    }

    function onCondeseJSON() {
        try {
            let parsedJSON = JSON.parse(jsonLintInput);
            setJsonLintOutput(JSON.stringify(parsedJSON))
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                console.log(error);
                setStatusText((<><Text span color='red'>JSON is invalid</Text><br /><Text span>{error.toString()}</Text></>));
                setJsonLintOutput("");
            }
            else {
                {/* @ts-ignore */}
                setStatusText((<><Text span color='red'>JSON is invalid</Text><br /><Text span>{error.message}</Text></>));
                setJsonLintOutput("");
            }
        }
    }

    function onCopyToClipboard() {
        navigator.clipboard.writeText(jsonLintOutput);
        setStatusText((<Text span color='green'>Output copied to clipboard</Text>));
    }

    return (
        <Container fluid flex={1} maw={'86%'} style={{height: '100vh', width: '100%'}}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}>JSON Linter</Text>
            </Title>

            <Textarea
                description='Place JSON into field below and use buttons to interact'
                autosize
                minRows={10}
                maxRows={20}
                value={jsonLintInput}
                onChange={e => setJsonLintInput(e.target.value)}>
            </Textarea>

            <Space h='md'></Space>

            <SimpleGrid cols={3}>
                <Button color='grape' onClick={onParseJSON}><IconCheck/>Validate JSON</Button>
                <Button color='grape' onClick={onPrettyJSON}><IconNotebook/>Prettify JSON</Button>
                <Button color='grape' onClick={onCondeseJSON}><IconWeight/>Condense JSON</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Output</Text>
                <ScrollArea.Autosize mah={300} type='always'>
                    <CodeHighlight code={jsonLintOutput} language='json' withCopyButton={false}></CodeHighlight>
                </ScrollArea.Autosize>
                <Button color='grape' onClick={onCopyToClipboard} disabled={jsonLintOutput==''}><IconClipboard/>Copy to clipboard</Button>
            </SimpleGrid>

            <Space h='xl'></Space>
            <Space h='xl'></Space>

        </Container>
    );

}