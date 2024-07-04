import { Button, Group, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  function getColorSchemeButton(type : any, displayName : any) {
    if (type === colorScheme) {
      return (<Button color='grape' onClick={() => setColorScheme(type)} variant='filled'>{displayName}</Button>)
    }
    else {
      return (<Button color='grey' onClick={() => setColorScheme(type)} variant='outline'>{displayName}</Button>)
    }
  }
  return (
    <Group justify="center">
      {getColorSchemeButton('light', "Light")}
      {getColorSchemeButton('dark', "Dark")}
      {getColorSchemeButton('auto', "Auto")}
    </Group>
  );
}
