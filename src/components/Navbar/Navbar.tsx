import { Group, Code, Text, Space, Button, Modal, SimpleGrid, Title } from '@mantine/core';
import {
    IconJson,
    IconLockOpen,
    IconKey,
    IconBook,
    IconFileTypeXml,
    IconHtml,
    IconFileCode2,
    IconArrowBarLeft,
    IconArrowBarRight,
    IconUser,
    IconClock
} from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { useState } from 'react';
import { useMantineTheme } from '@mantine/core';

const data = [
    { link: '', label: 'JSON Linter', icon: IconJson },
    { link: '', label: 'XML Linter', icon: IconFileTypeXml },
    { link: '', label: 'HTML Linter', icon: IconHtml },
    { link: '', label: 'Base64 Decoder', icon: IconLockOpen },
    { link: '', label: 'URL Decoder', icon: IconFileCode2 },
    { link: '', label: 'JWT Viewer', icon: IconKey },
    { link: '', label: 'Epoch Decoder', icon: IconClock },
    { link: '', label: 'Input Compare', icon: IconBook }
];

export function NavbarSimple(props : any) {

    const CURRENT_VERSION = "v1.7.0";
    const CURRENT_VERSION_DATE = "07/21/2024";

    const theme = useMantineTheme();

    const [collapsed, setCollapsed] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    function toggleCollapse() {
        setCollapsed(!collapsed);
    }

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === props.currentView || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                props.setCurrentView(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    const linksCollapse = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === props.currentView || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                props.setCurrentView(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} style={{flex: 1, margin: 0, marginRight: 0}} />
        </a>
    ));

    function getAboutModel() {
        return (
            <Modal opened={showInfoModal} withCloseButton={false} onClose={() => setShowInfoModal(false)} overlayProps={{backgroundOpacity: 0.55, blur:3}} centered>
                <center style={{fontSize: 54}}>
                    <Text inherit variant="gradient" component="span" gradient={{ from: theme.colors.pink[3], to: theme.colors.blue[3] }}><b>About</b></Text>
                    </center>
                <SimpleGrid cols={2} spacing={'xs'}>
                    <Text>Created By:</Text>
                    <Text><a href='https://twistedtwigleg.itch.io/'>TwistedTwigleg</a></Text>

                    <Text>Current Version:</Text>
                    <Code fw={700}>{CURRENT_VERSION}</Code>

                    <Text>Updated On:</Text>
                    <Code fw={700}>{CURRENT_VERSION_DATE}</Code>

                    <Button color='grape' onClick={() => window.open("https://github.com/TwistedTwigleg/ReactJavascriptUtils")}>View Source</Button>
                    <Button color='pink' onClick={() => setShowInfoModal(false)}>Close</Button>
                </SimpleGrid>
            </Modal>
        );
    }

    if (collapsed === false) {
        return (
            <>
                {getAboutModel()}
                
                <nav className={classes.navbar}>
                    <div className={classes.navbarMain}>
                        <Group className={classes.header} justify="space-between">
                            <Group>
                                <Button color='pink' onClick={toggleCollapse}><IconArrowBarLeft/></Button>
                                <Text>Javascript Utils</Text>
                            </Group>
                            <Code fw={700}>{CURRENT_VERSION}</Code>
                        </Group>
                        {links}
                    </div>

                    <div className={classes.footer}>
                        <Space h='md'></Space>
                        <Text size='xs'>Website Theme</Text>
                        <Space h='xs'></Space>
                        <ColorSchemeToggle></ColorSchemeToggle>
                        <Space h='md'></Space>
                        <Button style={{width:"100%"}} color='pink' onClick={() => setShowInfoModal(true)}><IconUser/> About</Button>
                    </div>
                </nav>
            </>
        );
    }
    else {
        return (
            <>
                {getAboutModel()}

                <nav className={classes.navbar} style={{width: '90px'}}>
                    <div className={classes.navbarMain}>
                        <Group className={classes.header} justify="space-between">
                            <Group>
                                <Button color='pink' onClick={toggleCollapse} flex={1}><IconArrowBarRight/></Button>
                            </Group>
                        </Group>
                        {linksCollapse}
                    </div>
                    <div className={classes.footer}>
                        <Button style={{width:"100%"}} color='pink' onClick={() => setShowInfoModal(true)}><IconUser/></Button>
                    </div>
                </nav>
            </>
        );
    }
}