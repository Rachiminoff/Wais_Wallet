import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f4248',
  },
  headerRightPlaceholder: {
    width: 32,
  },
  
  // Container
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  
  // Sections
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '900', // Extra bold
    color: '#0f4248',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionLabel1: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9d9d9d',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  
  // Input Containers
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#fff',
  },
  inputContainerSelected: {
    borderColor: '#0f4248',
    borderWidth: 2,
  },
  
  // Pocket Input Container
  pocketInputContainer: {
    marginTop: 12,
  },
  
  // Dropdown Styles
  dropdownSelected: {
    flex: 1,
  },
  dropdownSelectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f4248',
    marginBottom: 4,
  },
  dropdownSelectedAmount: {
    fontSize: 14,
    color: '#666',
  },
  
  // Amount Input
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#0f4248',
    paddingVertical: 20,
    paddingLeft: 8,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f4248',
  },
  
  // Note Input
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0f4248',
    minHeight: 100,
  },
  
  // Continue Button
  continueButton: {
    backgroundColor: '#0f4248',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f4248',
  },
  dropdownList: {
    paddingHorizontal: 20,
  },
  dropdownItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f4248',
  },
  dropdownItemAmount: {
    fontSize: 14,
    color: '#666',
  },

  // Success Modal Styles
  successModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  successModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f4248',
    marginBottom: 30,
    textAlign: 'center',
  },
  transactionDetailsBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  transactionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionDetailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  transactionDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f4248',
    flex: 1,
    textAlign: 'right',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f4248',
  },
  goHomeButton: {
    backgroundColor: '#0f4248',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goHomeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});

export default styles;