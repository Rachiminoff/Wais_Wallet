import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AboutPage() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background, paddingTop: 30 }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* TITLE */}
        <Text style={[styles.title, { color: colors.text }]}>
          About Wais Wallet
        </Text>

        {/* INTRODUCTION */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Wais Wallet is a personal finance and budgeting application developed to assist users in managing their finances through the envelope budgeting system. The application enables users to allocate funds into designated pockets, track expenditures, and monitor savings, while operating entirely offline.
          </Text>

          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            This application is intended for personal use within the Philippines and does not connect to external servers or cloud-based services. All data generated within the application is stored locally on the user’s device.
          </Text>
        </View>

        {/* LEGAL DISCLAIMER */}
        <Text style={[styles.section, { color: colors.muted }]}>
          Legal Disclaimer
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Wais Wallet is not a bank, e-wallet, financial institution, or licensed financial service provider. The application does not process real monetary transactions, facilitate payments, or provide financial, investment, or legal advice.
          </Text>

          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            All balances, transactions, and financial records displayed in the application are entered by the user for tracking and educational purposes only. The developers shall not be held liable for any financial decisions, losses, or damages arising from the use of this application.
          </Text>
        </View>

        {/* PRIVACY & DATA */}
        <Text style={[styles.section, { color: colors.muted }]}>
          Privacy and Data Handling
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Wais Wallet does not collect, transmit, or store user data on external servers. All information is saved locally on the user’s device and will be permanently deleted if the application data is cleared or the account is removed.
          </Text>
        </View>

        {/* APPLICATION INFORMATION */}
        <Text style={[styles.section, { color: colors.muted }]}>
          Application Information
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.listItem, { color: colors.textSecondary }]}>
            • Application Name: Wais Wallet
          </Text>
          <Text style={[styles.listItem, { color: colors.textSecondary }]}>
            • Version: 1.0.1
          </Text>
          <Text style={[styles.listItem, { color: colors.textSecondary }]}>
            • Release Type: Academic / Educational
          </Text>
          <Text style={[styles.listItem, { color: colors.textSecondary }]}>
            • Platform: Android
          </Text>
          <Text style={[styles.listItem, { color: colors.textSecondary }]}>
            • Availability: Philippines only
          </Text>
          <Text style={[styles.listItem, { color: colors.textSecondary }]}>
            • Connectivity: Fully offline
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 20,
  },

  section: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 28,
  },

  card: {
    borderRadius: 14,
    padding: 16,
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },

  listItem: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
  },
});
