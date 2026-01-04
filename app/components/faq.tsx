import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

/* =========================
   FAQ ITEM
========================= */

const FAQItem = ({
  question,
  answer,
  colors,
}: {
  question: string;
  answer: string;
  colors: any;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View
      style={[
        styles.item,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={styles.questionRow}
        activeOpacity={0.7}
      >
        <Text style={[styles.question, { color: colors.text }]}>
          {question}
        </Text>
        <Text style={[styles.chevron, { color: colors.muted }]}>
          {open ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {open && (
        <Text
          style={[
            styles.answer,
            { color: colors.textSecondary },
          ]}
        >
          {answer}
        </Text>
      )}
    </View>
  );
};

/* =========================
   FAQ DATA 
========================= */

const FAQ_DATA = [
  {
    section: 'General Purpose',
    items: [

      {
        question: 'What are Pockets?',
        answer:
          'Pockets are budget categories such as Rent, Bills, Groceries, Transportation, Pang-Gala (Leisure), and Savings.',
      },
      {
        question: 'What is Safe Balance?',
        answer:
          'Safe Balance is money that has not yet been allocated to any pocket or savings goal. It is the source used for allocations and savings.',
      },
      {
        question: 'How does the Budget Planner work?',
        answer:
          'The Budget Planner allows you to allocate your income into pockets before spending, helping prevent overspending.',
      },
      {
        question: 'Can I set saving goals?',
        answer:
          'Yes. You can create saving goals, add money from your Safe Balance, and track progress visually.',
      },
      {
        question: 'Is my data secure?',
        answer:
          'Your data is stored locally on your device. Wais Pocket does not upload financial data to external servers.',
      },
      {
        question: 'Is this a real financial service?',
        answer:
          'No. Wais Pocket is a school project built with React Native and Expo to demonstrate mobile development and finance concepts.',
      },
    ],
  },
  {
    section: 'Technical Guide',
    items: [
      {
        question: 'What does Total Balance mean?',
        answer:
          'Total Balance represents your entire available money in the app, including Safe Balance, all Wais Pockets, and Savings.',
      },
      {
        question: 'How does Safe Balance work technically?',
        answer:
          'Safe Balance is the unallocated portion of your Total Balance. All allocations to pockets and savings are deducted from Safe Balance.',
      },
      {
        question: 'How do Wais Pockets work internally?',
        answer:
          'Each Wais Pocket has its own balance. When funds are allocated, money moves from Safe Balance into the selected pocket.',
      },
      {
        question: 'How does Add Funds work?',
        answer:
          'Add Funds does not involve real money. It is a manual entry that should reflect the money you actually have in real life.\n\nWhen you add an amount, it is added to both your Safe Balance and Total Balance. Safe Balance represents unallocated money that you can later distribute to your pockets or savings.\n\nYou may also subtract funds to reflect expenses or money leaving your account. However, if the amount you try to deduct is greater than the combined balance of your pockets and savings, the app will prevent the action and show an error. This ensures your account never goes into a negative balance.\n\nAdditionally, you can directly add funds to specific pockets from this page, allowing you to immediately assign money to its intended purpose.',
      },
      {
        question: 'How does Transfer Funds work?',
        answer:
          'Transfer Funds lets you move money from your Wais Pockets back into your Safe Balance. This is useful when you need to reallocate unused funds or make them available for new allocations, savings, or spending.',
      },
      {
        question: 'Why are there two pie charts on the dashboard?',
        answer:
          'The dashboard contains two pie charts to visualize money in different ways: pocket distribution and overall allocation.',
      },
      {
        question: 'What does the Pocket Distribution pie chart show?',
        answer:
          'This chart shows percentages based on the total pocket balance only. It helps visualize how money is distributed among your Wais Pockets.',
      },
      {
        question: 'What does the Allocation Help pie chart show?',
        answer:
          'This chart shows the distribution of your current Total Balance, helping you understand how much money is allocated versus still in Safe Balance.',
      },
      {
        question: 'Why do the charts update automatically?',
        answer:
          'Both charts recalculate whenever balances change due to adding funds, allocating pockets, subtracting funds, or updating savings.',
      },
      {
        question: 'How does Transaction History work?',
        answer:
          'Transaction History records every balance change in the app, including adding funds, spending, transferring between pockets, and adjusting savings. Each entry shows what action happened, when it occurred, and how it affected your balance.\n\nHow to read the amounts:\n\n- Negative (−) values mean money was removed from that source\n\n- Positive (+) values mean money was added to that source',
      },
      {
        question: 'How do Savings work internally?',
        answer:
          'Savings can only be added using money from Safe Balance. If you attempt to add more than your available Safe Balance, the app will prevent the action and show an error.',
      },
      {
        question: 'What happens when I subtract funds?',
        answer:
          'Subtracting funds reduces your Total Balance and Safe Balance. The app validates that your combined pocket and savings balances are sufficient before allowing the transaction.',
      },
      {
        question: 'How is my data stored?',
        answer:
          'All financial data is stored locally on your device using fast key-value storage. No cloud sync or external servers are used.',
      },
      {
        question: 'Can I recover my account after deleting it?',
        answer:
          'No. Once your account is deleted, all data is permanently removed from your device, including transactions, pockets, and savings. Wais Pocket does not have backups or cloud recovery, so deleted data cannot be restored.',
      },
      {
        question: 'Does the app work offline?',
        answer:
          'Yes. Wais Pocket is fully offline and works without an internet connection.',
      },
    ],
  },
];

/* =========================
   FAQ PAGE
========================= */

export default function FAQPage() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search.trim()) return FAQ_DATA;

    const q = search.toLowerCase();

    return FAQ_DATA.map(section => ({
      ...section,
      items: section.items.filter(
        item =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q),
      ),
    })).filter(section => section.items.length > 0);
  }, [search]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Help & FAQ
        </Text>

        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Learn how Wais Wallet works and how to use it effectively.
        </Text>

        {/* SEARCH */}
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search questions..."
          placeholderTextColor={colors.muted}
          style={[
            styles.search,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {filteredData.map(section => (
          <View key={section.section}>
            <Text
              style={[
                styles.section,
                { color: colors.muted },
              ]}
            >
              {section.section}
            </Text>

            {section.items.map(item => (
              <FAQItem
                key={item.question}
                colors={colors}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </View>
        ))}
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
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },

  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 24,
  },

  section: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 24,
  },

  item: {
    borderBottomWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  question: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    paddingRight: 10,
  },

  chevron: {
    fontSize: 12,
  },

  answer: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
  },
});
