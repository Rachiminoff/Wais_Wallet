import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const PRIMARY = '#0f4248';
const MUTED = '#6c7c7c';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* ================= HEADER ================= */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  /* ================= CONTAINER ================= */
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* ================= SECTION ================= */
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  /* ================= INPUTS ================= */
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 20,
    backgroundColor: '#fff',
  },

  dropdownSelectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY,
  },

  /* ================= AMOUNT ================= */
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: PRIMARY,
  },

  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: PRIMARY,
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
    justifyContent: 'flex-end',
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

  dropdownCancel: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 16,
    fontWeight: '700',
    color: '#d9534f',
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
