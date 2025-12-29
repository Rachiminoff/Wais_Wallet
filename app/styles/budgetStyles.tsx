import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: '#1C2B3A',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
  },

  mutedText: {
    color: '#8E8E93',
    fontWeight: '400',
  },

  balanceText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },

  pocketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  pocketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  pocketName: {
    fontSize: 14,
    color: '#000',
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
