// components/ThemeWrapper.tsx
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Props {
  children: React.ReactNode;
  scroll?: boolean; // wrap children in ScrollView if true
}

export const ThemeWrapper: React.FC<Props> = ({ children, scroll }) => {
  const { colors } = useTheme();

  const Container: any = scroll ? ScrollView : View;

  return (
    <Container
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={scroll ? { flexGrow: 1 } : undefined}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
