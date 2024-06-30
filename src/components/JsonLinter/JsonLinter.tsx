import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space, FileInput, Group } from '@mantine/core';
import { useState } from 'react';
import { CodeHighlight } from '@mantine/code-highlight';
import { useMantineTheme } from '@mantine/core';

import {
    IconCheck,
    IconNotebook,
    IconWeight,
    IconClipboard,
    IconPaperclip,
    IconFile
} from '@tabler/icons-react';

export function JsonLinter() {

    const [jsonLintInput, setJsonLintInput] = useState('');
    const [jsonLintOutput, setJsonLintOutput] = useState('');
    const [jsonFileValue, setJsonFileValue] = useState<File | null>(null);
    
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
            let jsonStringifyCount = 0;
            let jsonStringifyError = null;
            let jsonStringifyOutput = jsonLintInput;
            while (jsonStringifyCount < 10) {
                try {
                    jsonStringifyOutput = JSON.parse(jsonStringifyOutput);
                    jsonStringifyCount += 1;
                } catch(error) {
                    jsonStringifyError = error;
                    break;
                }
            }
            if (jsonStringifyCount <= 0) {
                throw jsonStringifyError;
            }
            setJsonLintOutput(JSON.stringify(jsonStringifyOutput, undefined, "  "))
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
            let jsonStringifyCount = 0;
            let jsonStringifyError = null;
            let jsonStringifyOutput = jsonLintInput;
            while (jsonStringifyCount < 10) {
                try {
                    jsonStringifyOutput = JSON.parse(jsonStringifyOutput);
                    jsonStringifyCount += 1;
                } catch(error) {
                    jsonStringifyError = error;
                    break;
                }
            }
            if (jsonStringifyCount <= 0) {
                throw jsonStringifyError;
            }
            setJsonLintOutput(JSON.stringify(jsonStringifyOutput))
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

    function onStringifyJSON() {
        try {
            let stringifiedJSON = JSON.stringify(jsonLintInput);
            setJsonLintOutput(stringifiedJSON)
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

    function onFileLoad(value : File | null ) {
        setJsonFileValue(value);

        if (value !== null) {
            if(!window.FileReader) {
                console.log("ERROR - browser is not compatible to read files!");
                setJsonLintInput("Could not read file - browser is not compatible");
                return; // Browser is not compatible
            }
            var reader = new FileReader();
            reader.readAsText(value);
            reader.onloadend = function() {
                let resStr = reader.result?.toString() || "";
                setJsonLintInput(resStr);
            }
        }
        else {
            setJsonLintInput("");
        }
    }

    function onCopyToClipboard() {
        navigator.clipboard.writeText(jsonLintOutput);
        setStatusText((<Text span color='green'>Output copied to clipboard</Text>));
    }

    function onDownloadFilePressed() {
        downloadAsFile(jsonLintOutput, "jsonOutput.json", "text/plain");
    }
    function downloadAsFile(data : any, filename : string, type : string) {
        // CREDIT: https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
        var file = new Blob([data], {type: type});
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }

    return (
        <Container fluid flex={1} maw={'100%'} style={{height: '100vh', width: '100%'}}>
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

            <Group>
                <Text>Upload file:</Text>
                <FileInput flex={1} value={jsonFileValue} onChange={onFileLoad} placeholder="Click to upload JSON file" clearable></FileInput>
            </Group>

            <Space h='md'></Space>

            <SimpleGrid cols={4}>
                <Button color='grape' onClick={onParseJSON}><IconCheck/>Validate JSON</Button>
                <Button color='grape' onClick={onPrettyJSON}><IconNotebook/>Prettify JSON</Button>
                <Button color='grape' onClick={onCondeseJSON}><IconWeight/>Condense JSON</Button>
                <Button color='grape' onClick={onStringifyJSON}><IconPaperclip/>Stringify JSON</Button>
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
            </SimpleGrid>
            <Space h='xs'></Space>
            <SimpleGrid cols={2}>
                <Button color='grape' onClick={onCopyToClipboard} disabled={jsonLintOutput==''}><IconClipboard/>Copy to clipboard</Button>
                <Button color='grape' onClick={onDownloadFilePressed} disabled={jsonLintOutput==''}><IconFile/>Save to File</Button>
            </SimpleGrid>

            <Space h='xl'></Space>
            <Space h='xl'></Space>

        </Container>
    );

}