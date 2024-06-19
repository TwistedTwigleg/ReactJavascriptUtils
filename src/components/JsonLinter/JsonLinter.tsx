import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';

export function JsonLinter() {

    const [jsonLintInput, setJsonLintInput] = useState('');
    const [jsonLintOutput, setJsonLintOutput] = useState('');
    
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>)

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
            }
            else {
                {/* @ts-ignore */}
                setStatusText((<><Text span color='red'>JSON is invalid</Text><br /><Text span>{error.message}</Text></>));
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
            }
            else {
                {/* @ts-ignore */}
                setStatusText((<><Text span color='red'>JSON is invalid</Text><br /><Text span>{error.message}</Text></>));
            }
        }
    }

    function onCopyToClipboard() {
        navigator.clipboard.writeText(jsonLintOutput);
        setStatusText((<Text span color='green'>Output copied to clipboard</Text>));
    }

    return (
        <Container fluid flex={1} maw={'86%'}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: 'rgb(255, 142, 243)', to: 'rgb(142, 255, 255)' }}>JSON Linter</Text>
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
                <Button color='grape' onClick={onParseJSON}>Validate JSON</Button>
                <Button color='grape' onClick={onPrettyJSON}>Prettify JSON</Button>
                <Button color='grape' onClick={onCondeseJSON}>Condense JSON</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <Text>Output</Text>
            <Button color='grape' onClick={onCopyToClipboard}>Copy to clipboard</Button>
            <ScrollArea.Autosize mah={300} type='always' offsetScrollbars>
                <CodeHighlight code={jsonLintOutput} language='json' withCopyButton={false}></CodeHighlight>
            </ScrollArea.Autosize>

            <Space h='xl'></Space>
            <Space h='xl'></Space>

        </Container>
    );

}