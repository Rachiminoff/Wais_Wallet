import React from 'react';
import { Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { formatCurrencyDisplay } from '../scripts/home';

/* ====================
   MATCH POCKET CHART
==================== */
const CHART_SIZE = 220;
const CHART_CONTAINER_WIDTH = 240;
const CHART_CENTER_X = 60;

interface Props {
  safeBalance: number;
  pocketTotal: number;
  savingsTotal: number;
  currency: string;
}

export const AllocationHealthChart: React.FC<Props> = ({
  safeBalance,
  pocketTotal,
  savingsTotal,
  currency,
}) => {
  const { colors } = useTheme();

  const total =
    safeBalance + pocketTotal + savingsTotal;

  if (total <= 0) {
    return (
      <View
        style={{
          marginHorizontal: 12,
          backgroundColor: colors.card,
          borderRadius: 24,
          padding: 18,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: colors.muted }}>
          No balance data available
        </Text>
      </View>
    );
  }

  /* ====================
     SEMANTIC COLORS
  ==================== */
  const data = [
    {
      name: 'Safe',
      amount: safeBalance,
      color: '#8B5CF6', // Purple
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Pockets',
      amount: pocketTotal,
      color: '#EF4444', // Red
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Savings',
      amount: savingsTotal,
      color: '#2c2c2dff', // Gray
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
  ].filter(d => d.amount > 0);

  return (
    <View
      style={{
        marginHorizontal: 12,
        backgroundColor: colors.card,
        borderRadius: 24,
        paddingVertical: 18,
        marginBottom: 12,
      }}
    >
      {/* TITLE */}
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 12,
          paddingLeft: 18,
        }}
      >
        ALLOCATION HEALTH
      </Text>

      {/* CHART + LEGEND */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 18,
        }}
      >
        {/* LOCKED CHART WIDTH */}
        <View
          style={{
            width: CHART_CONTAINER_WIDTH,
            alignItems: 'center',
          }}
        >
          <PieChart
            data={data}
            width={CHART_SIZE}
            height={CHART_SIZE}
            accessor="amount"
            backgroundColor="transparent"
            hasLegend={false}
            center={[CHART_CENTER_X, 0]}
            chartConfig={{
              color: () => colors.text,
            }}
          />
        </View>

        {/* LEGEND */}
        <View style={{ marginLeft: 12, flex: 1 }}>
          {data.map(item => {
            const percent = Math.round(
              (item.amount / total) * 100
            );

            return (
              <View
                key={item.name}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 14,
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: item.color,
                    marginRight: 10,
                  }}
                />

                <View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: colors.text,
                    }}
                  >
                    {percent}% {item.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.muted,
                    }}
                  >
                    {
                      formatCurrencyDisplay(
                        item.amount,
                        currency
                      ).full
                    }
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* FOOTER */}
      <Text
        style={{
          marginTop: 12,
          fontSize: 11,
          color: colors.muted,
          textAlign: 'center',
        }}
      >
        Distribution of your current total balance
      </Text>
    </View>
  );
};
