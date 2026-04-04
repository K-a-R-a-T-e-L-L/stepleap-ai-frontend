import { Card, Text } from "@mantine/core";

export default function AiUnavailableCard() {
  return (
    <Card
      radius="lg"
      p="md"
      style={{
        background: "rgba(58, 20, 28, 0.72)",
        border: "1px solid rgba(255, 172, 172, 0.24)",
      }}
    >
      <Text c="#ff6b6b" fw={700}>
        Сервис временно недоступен
      </Text>
    </Card>
  );
}
