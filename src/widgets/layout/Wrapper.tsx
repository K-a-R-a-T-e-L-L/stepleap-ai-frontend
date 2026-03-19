import { Box } from "@mantine/core";
import { ReactNode } from "react";

const Wrapper = ({
  children,
  bgColor,
}: {
  children: ReactNode;
  bgColor: string;
}) => {
  return (
    <Box
      style={{
        background: `linear-gradient(180deg, ${bgColor} 0%, #0f1722 100%)`,
        width: "100%",
        maxWidth: "100%",
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        color: "white",
        padding: "12px",
        flexDirection: "column",
        rowGap: "12px",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
