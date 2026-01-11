import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    marginTop: 40,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },

  addButton: {
    backgroundColor: '#1C2B3A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },

  addButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },

  filterText: {
    fontSize: 12,
  },

  expenseGroup: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },

  dateText: {
    fontSize: 15,
    fontWeight: '600',
  },

  dateIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  expenseLabel: {
    fontSize: 14,
  },

  expenseNote: {
    fontSize: 12,
    marginTop: 2,
  },

  expenseAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF3B30',
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
