import { StyleSheet } from 'react-native';

const PRIMARY = '#0f3d3e';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  /* HEADER */
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

  primaryButton: {
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
    marginBottom: 28,
    marginTop: 12,
  },

  primaryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  addGoalButton: {
    backgroundColor: '#1C2B3A',
  },

  /* CONTENT */
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

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  goalName: {
    fontSize: 14,
    fontWeight: '600',
  },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },

  currentAmount: {
    fontSize: 18,
    fontWeight: '700',
  },

  targetAmount: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },

  /* PROGRESS */
  progressBackground: {
    height: 24,
    backgroundColor: '#dbe6e4',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#6fa3a1',
    justifyContent: 'center',
    paddingLeft: 10,
  },

  progressText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  addSavingsButton: {
    backgroundColor: '#1C2B3A',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  addSavingsText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.3,
  },

  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 40,
  },

  /* BOTTOM NAV */
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  navItem: {
    alignItems: 'center',
  },

  navItemText: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },

  navItemTextActive: {
    fontSize: 11,
    color: PRIMARY,
    fontWeight: '600',
    marginTop: 2,
  },
});
