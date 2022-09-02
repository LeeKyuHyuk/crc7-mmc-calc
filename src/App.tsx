import { Button, Form, Input, Typography } from 'antd';
import { useState } from 'react';

const { Title, Text } = Typography;

type Crc7InputItem = {
  command: string;
  argument: string;
};

function hexValidator(_inputItem: any, value: string) {
  const hexRegex = /^[0-9a-fA-F]+$/;
  if (hexRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject();
}

function crc7(input: Uint8Array, count: number) {
  let crc = Uint8Array.from([0]);
  for (let inputIndex = 0; inputIndex < count; inputIndex++) {
    let value = Uint8Array.from([input[inputIndex]]);
    for (let index = 0; index < 8; index++) {
      crc[0] = crc[0] << 1;
      if ((value[0] & 0x80) ^ (crc[0] & 0x80)) {
        crc[0] = crc[0] ^ 0x09;
      }
      value[0] = value[0] << 1;
    }
  }
  return (crc[0] << 1) & ~0x100;
}

function App() {
  const [crcValue, setCrcValue] = useState<string>('');

  function onCalculate(value: Crc7InputItem) {
    const command = parseInt(value.command, 16);
    const argument = parseInt(value.argument, 16);
    const input = Uint8Array.from([
      command | 0x40,
      argument >> 24,
      argument >> 16,
      argument >> 8,
      argument,
    ]);
    console.log(input);
    console.log();
    setCrcValue(`0x${crc7(input, 5).toString(16)}`);
  }

  return (
    <div style={{ padding: '24px 5%' }}>
      <div style={{ width: '100%', textAlign: 'center', marginBottom: '16px' }}>
        <Title>CRC7-MMC Calculator</Title>
      </div>
      <Form
        name="crc7"
        initialValues={{ remember: true }}
        onFinish={onCalculate}
        autoComplete="off"
      >
        <Form.Item
          label="Command"
          name="command"
          rules={[
            {
              required: true,
              message: 'Please input command hex value!',
              validator: hexValidator,
            },
          ]}
        >
          <Input addonBefore="0x" maxLength={2} placeholder="For example, for CMD8, enter 0x08" />
        </Form.Item>

        <Form.Item
          label="Argument"
          name="argument"
          rules={[
            {
              required: true,
              message: 'Please input argument hex value!',
              validator: hexValidator,
            },
          ]}
        >
          <Input
            addonBefore="0x"
            maxLength={8}
            placeholder="Enter a 32-bit Argument as a HEX value"
          />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" size="large" htmlType="submit">
            Calculate
          </Button>
        </Form.Item>
      </Form>

      {crcValue.length !== 0 && (
        <div style={{ width: '100%', textAlign: 'center', marginTop: '16px' }}>
          <Title>
            CRC :<Text code>{crcValue}</Text>
          </Title>
        </div>
      )}
    </div>
  );
}

export default App;
