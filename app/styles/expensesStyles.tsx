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
    paddingBottom: 16,
    marginTop: 40,
    marginBottom: 4,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },

  addButton: {
    backgroundColor: '#1C2B3A',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },

  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  editButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  historyButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },

  historyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
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

  toastMessage: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
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
