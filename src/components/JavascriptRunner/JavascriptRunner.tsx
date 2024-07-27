import { Title, Text, ScrollArea, Textarea, Button, SimpleGrid, Container, Space } from '@mantine/core';
import { useState } from 'react';
import { useMantineTheme } from '@mantine/core';
import {
    IconClipboard,
    IconFile,
    IconScript
} from '@tabler/icons-react';

export function JavascriptRunner() {

    const [codeInput, setCodeInput] = useState(localStorage.getItem("JavascriptRunner_CodeInput") || "");
    const [statusText, setStatusText] = useState(<Text span>Empty</Text>)
    const theme = useMantineTheme();

    function onCopyToClipboard() {
        navigator.clipboard.writeText(codeInput);
        setStatusText((<Text span color='green'>Script copied to clipboard</Text>));
    }

    function executeInputCode() {
        const runEval = eval;
        try {
            runEval(codeInput);
            setStatusText((<Text span color='green'>Executed code</Text>));
        } catch (error) {
            setStatusText((<Text span color='red'>Code failed: {JSON.stringify(error)}</Text>));
        }
    }

    function onDownloadFilePressed() {
        downloadAsFile(codeInput, "javascriptSnipper.js", "text/plain");
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

    function onSaveToLocalStorage() {
        localStorage.setItem("JavascriptRunner_CodeInput", codeInput);
        setStatusText((<Text span color='green'>Saved to LocalStorage</Text>));
    }
    function onClearFromLocalStorage() {
        localStorage.removeItem("JavascriptRunner_CodeInput");
        setStatusText((<Text span color='green'>Cleared LocalStorage</Text>));
    }

    return (
        <Container fluid flex={1} maw={'100%'} style={{height: '100vh', width: '100%'}}>
            <Title ta='center' mt={100} size='72'>
                <Text inherit variant="gradient" component="span" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}>Javascript Runner</Text>
            </Title>

            <Textarea
                description='Place Javascript code into field below and use buttons to interact'
                autosize
                minRows={10}
                maxRows={20}
                value={codeInput}
                onChange={e => setCodeInput(e.target.value)}>
            </Textarea>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Button color='grape' onClick={executeInputCode}><IconScript/>Execute Code</Button>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>Status: {statusText}</Text>
            </SimpleGrid>

            <Space h='md'></Space>

            <SimpleGrid cols={1}>
                <Text>View the Javascript console for output if using <span style={{color:'grey'}}>console.log</span> or similar. You can view the console by right clicking and selecting "inspect" or similar.</Text>
            </SimpleGrid>
            <Space h='xs'></Space>
            <SimpleGrid cols={2}>
                <Button color='grape' onClick={onCopyToClipboard} disabled={codeInput==''}><IconClipboard/>Copy to clipboard</Button>
                <Button color='grape' onClick={onDownloadFilePressed} disabled={codeInput==''}><IconFile/>Save to File</Button>
            </SimpleGrid>
            <Space h='xs'></Space>
            <SimpleGrid cols={2}>
                <Button color='grape' onClick={onSaveToLocalStorage}><IconFile/>Save to LocalStorage</Button>
                <Button color='grape' onClick={onClearFromLocalStorage}><IconFile/>Clear LocalStorage</Button>
            </SimpleGrid>
        </Container>
    );

}