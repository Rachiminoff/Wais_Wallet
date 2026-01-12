import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: 40,
    marginBottom: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
    marginTop: 12,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: '#1C2B3A',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },

  primaryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    letterSpacing: 0.2,
    opacity: 0.7,
  },

  mutedText: {
    color: '#8E8E93',
    fontWeight: '400',
    fontSize: 13,
  },

  balanceText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 12,
    marginHorizontal: 0,
    opacity: 0.6,
  },

  pocketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  pocketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },

  pocketName: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },

  pocketAmount: {
    fontSize: 14,
    fontWeight: '500',
  },

  negative: {
    color: '#FF3B30',
  },

  neutral: {
    color: '#000',
  },

  positive: {
    color: '#34C759',
  },

  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  navItemText: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },

  navItemTextActive: {
    fontSize: 11,
    color: '#007AFF',
    marginTop: 2,
  },
});
