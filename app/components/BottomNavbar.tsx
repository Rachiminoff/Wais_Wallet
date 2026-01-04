import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../context/ThemeContext';
import styles from '../styles/HomeScreenStyles';

type NavItemProps = {
  label: string;
  route: string;
  icon?: string;
  customIcon?: (color: string) => React.ReactNode;
};

export function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  /**
   * Active when:
   * - exact match (/home)
   * - nested routes (/BudgetScreen/edit)
   */
  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(route + '/');

  const NavItem = ({ label, route, icon, customIcon }: NavItemProps) => {
    const active = isActive(route);
    const color = active ? colors.primary : colors.muted;

    return (
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push(route)}
        activeOpacity={0.7}
      >
        {customIcon
          ? customIcon(color)
          : icon && (
              <Icon
                name={icon}
                size={22}
                color={color}
              />
            )}

        <Text
          style={[
            active ? styles.navItemTextActive : styles.navItemText,
            { color },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.bottomNavbar, { backgroundColor: colors.card }]}>
      <NavItem
        label="Dashboard"
        route="/home"
        icon="home-outline"
      />

      <NavItem
        label="Budget Plan"
        route="/BudgetScreen"
        icon="pie-chart-outline"
      />

      <NavItem
        label="Expenses"
        route="/cards"
        icon="card-outline"
      />

      <NavItem
        label="Savings"
        route="/savings"
        customIcon={(color) => (
          <MaterialCommunityIcons
            name="piggy-bank-outline"
            size={22}
            color={color}
          />
        )}
      />

      <NavItem
        label="Profile"
        route="/profile"
        icon="person-outline"
      />
    </View>
  );
}


