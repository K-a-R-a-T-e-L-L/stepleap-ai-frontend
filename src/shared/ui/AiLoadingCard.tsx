import { Card, Group, Loader, Text } from "@mantine/core";

type AiLoadingCardProps = {
  text?: string;
};

export default function AiLoadingCard({
  text = "Генерируем данные с помощью ИИ...",
}: AiLoadingCardProps) {
  return (
    <Card
      radius="lg"
      p="md"
      style={{
        background: "rgba(15, 26, 58, 0.8)",
        border: "1px solid rgba(166, 187, 246, 0.24)",
      }}
    >
      <Group gap={10}>
        <Loader size="sm" color="cyan" type="dots" />
        <Text c="rgba(212,225,255,0.82)">{text}</Text>
      </Group>
    </Card>
  );
}
