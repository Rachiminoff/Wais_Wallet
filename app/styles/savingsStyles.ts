import { StyleSheet } from 'react-native';

const PRIMARY = '#0f3d3e';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#efefef',
  },

  /* HEADER */
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    marginTop : 40,
  },

  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },

  addGoalButton: {
    backgroundColor: '#183645',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  addGoalText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  /* CONTENT */
  content: {
    padding: 20,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
    height: 14,
    backgroundColor: '#dbe6e4',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 14,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#6fa3a1',
    justifyContent: 'center',
    paddingLeft: 8,
  },

  progressText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },

  addSavingsButton: {
    backgroundColor: '#183645',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  addSavingsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
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
