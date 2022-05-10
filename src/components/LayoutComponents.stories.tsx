import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from './LayoutComponents';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>Button</Button>
);

export const Default = Template.bind({});
Default.args = {};
