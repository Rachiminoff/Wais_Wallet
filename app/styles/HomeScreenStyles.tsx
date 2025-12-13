import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // ====================
  // MAIN CONTAINERS
  // ====================
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // ====================
  // LOADING STATE
  // ====================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'System',
  },

  // ====================
  // TOP NAVBAR
  // ====================
  topNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appLogo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#007AFF',
    fontFamily: 'System',
    letterSpacing: 1,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  navIconButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },

  // ====================
  // FULL BALANCE CARD (#1a374a background)
  // ====================
  fullBalanceCard: {
    backgroundColor: '#1a374a',
    borderRadius: 24,
    margin: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },

  // Card header
  cardHeader: {
    marginBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#2a4a5a',
    paddingBottom: 20,
  },
  cardGreeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'System',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardEmail: {
    fontSize: 15,
    color: '#A0C1D1',
    fontFamily: 'System',
    fontWeight: '400',
  },

  // ====================
  // BALANCE ROWS
  // ====================
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  balanceLabelContainer: {
    flex: 1,
    paddingRight: 10,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#A0C1D1',
    fontFamily: 'System',
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceSubLabel: {
    fontSize: 12,
    color: '#8CA8B8',
    fontFamily: 'System',
    fontWeight: '400',
    fontStyle: 'italic',
  },

  // Total Balance (clickable)
  totalBalanceContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 180,
    alignItems: 'flex-end',
  },
  totalBalance: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  dotsContainer: {
    paddingVertical: 8,
  },
  dotsText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'System',
    letterSpacing: 4,
  },

  // ====================
  // BALANCE EDIT ROW
  // ====================
  balanceEditRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  editBalanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3a5a6a',
  },
  editBalanceText: {
    fontSize: 14,
    color: '#A0C1D1',
    fontFamily: 'System',
    fontWeight: '500',
  },

  // ====================
  // BREAKDOWN SECTION
  // ====================
  breakdownContainer: {
    backgroundColor: 'rgba(42, 74, 90, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#2a4a5a',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#A0C1D1',
    fontFamily: 'System',
    fontWeight: '500',
  },
  breakdownValue: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'System',
    fontWeight: '600',
  },
  safeBalanceHighlight: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  breakdownNote: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a4a5a',
  },
  breakdownNoteText: {
    fontSize: 12,
    color: '#8CA8B8',
    fontFamily: 'System',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // ====================
  // POCKETS SECTION
  // ====================
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'System',
    fontWeight: '500',
  },

  // POCKETS LIST
  pocketsList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // POCKET ROW
  pocketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
  },
  pocketRowLast: {
    borderBottomWidth: 0,
  },
  pocketName: {
    fontSize: 17,
    color: '#212529',
    fontFamily: 'System',
    fontWeight: '500',
    flex: 1,
  },
  pocketAmount: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a374a',
    fontFamily: 'System',
  },

  // ====================
  // MODAL STYLES
  // ====================
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    fontFamily: 'System',
  },
  modalCloseButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },

  // Operation Toggle
  operationToggle: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  operationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  operationButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  operationButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999',
    fontFamily: 'System',
  },
  operationButtonTextActive: {
    color: '#000',
    fontWeight: '700',
  },

  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'System',
    fontWeight: '500',
  },

  // Current Balances
  currentBalances: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  currentBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentBalanceLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
    fontWeight: '500',
  },
  currentBalanceValue: {
    fontSize: 16,
    color: '#1a374a',
    fontFamily: 'System',
    fontWeight: '700',
  },

  // Amount Input
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
    fontFamily: 'System',
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'System',
    padding: 0,
  },

  // Quick Amount Buttons
  quickAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },
  quickAmountText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'System',
  },

  // Description Input
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#F8F9FA',
    fontFamily: 'System',
  },

  // Action Button
  modalActionButton: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  addActionButton: {
    backgroundColor: '#4CAF50',
  },
  subtractActionButton: {
    backgroundColor: '#F44336',
  },
  modalActionButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  modalActionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },

  // ====================
  // BOTTOM NAVBAR
  // ====================
  bottomNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  navItemText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 6,
    fontFamily: 'System',
    fontWeight: '500',
  },
  navItemTextActive: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 6,
    fontFamily: 'System',
    fontWeight: '700',
  },
});

export default styles;