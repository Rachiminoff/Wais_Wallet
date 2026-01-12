import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const PRIMARY = '#0f4248';
const MUTED = '#6c7c7c';
const DANGER = '#d9534f';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  /* ================= HEADER ================= */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
    position: 'relative',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY,
  },

  divider: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },

  /* ================= CONTAINER ================= */
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* ================= SECTION ================= */
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY,
    marginBottom: 12,
    paddingBottom: 5,
  },

  /* ================= FORM ================= */
  formGroup: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  label: {
    fontSize: 13,
    color: '#9AA0A6',
    marginBottom: 6,
    fontWeight: '700',
  },

  /* ================= INPUTS ================= */
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f3f6f6',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  dropdownSelectedText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },

  /* ================= DROPDOWN LIST ================= */
  dropdownList: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    maxHeight: 250,
    marginBottom: 20,
  },

  dropdownScroll: {
    maxHeight: 250,
  },

  dropdownListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },

  dropdownListItemText: {
    fontSize: 15,
    fontWeight: '500',
  },

  dropdownListItemAmount: {
    fontSize: 15,
    fontWeight: '600',
  },

  /* ================= AMOUNT ================= */
  input: {
    backgroundColor: '#f3f6f6',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  amountInput: {
    opacity: 0.85,
  },

  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f6f6',
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 0,
  },

  amountInputContainerFocused: {
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },

  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: PRIMARY,
  },

  currencySymbolDanger: {
    fontSize: 28,
    fontWeight: '700',
    color: DANGER,
  },

  amountInputDanger: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: DANGER,
    paddingVertical: 18,
    paddingLeft: 8,
  },

  /* ================= NOTE ================= */
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: PRIMARY,
    minHeight: 100,
    marginBottom: 24,
  },

  /* ================= BUTTON ================= */
  continueButton: {
    backgroundColor: PRIMARY,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 28,
    marginHorizontal: 20,

  },

  continueText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  continueButtonDanger: {
    backgroundColor: DANGER,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 40,
  },

  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  /* =========================================================
     DROPDOWN MODALS
     ========================================================= */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  dropdownModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
  },

  dropdownItem: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  dropdownItemDanger: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 16,
    fontWeight: '700',
    color: DANGER,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  dropdownCancel: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 16,
    fontWeight: '700',
    color: DANGER,
    textAlign: 'center',
  },

  /* =========================================================
     SUCCESS MODAL
     ========================================================= */
  successModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center',
  },

  successImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },

  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: PRIMARY,
    marginVertical: 16,
  },

  successTitleDanger: {
    fontSize: 22,
    fontWeight: '700',
    color: DANGER,
    marginVertical: 16,
  },

  /* ===== TRANSACTION DETAILS ===== */
  transactionDetailsBox: {
    width: '100%',
    backgroundColor: '#f7f8f9',
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    marginBottom: 24,
  },

  transactionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  transactionDetailLabel: {
    fontSize: 14,
    color: MUTED,
  },

  transactionDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
  },

  transactionDetailValueDanger: {
    fontSize: 14,
    fontWeight: '700',
    color: DANGER,
  },

  /* ===== CTA ===== */
  goHomeButton: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },

  goHomeButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default styles;
