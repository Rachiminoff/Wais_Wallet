import { StyleSheet } from 'react-native';

const PRIMARY = '#0f4248';
const BORDER = '#E5E5E5';
const LABEL = '#9AA0A6';
const TEXT = '#111';

export default StyleSheet.create({
  /* =====================
     LAYOUT
  ===================== */
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    marginHorizontal: 16, 
    marginBottom: 24,
  },

  /* =====================
     FORM
  ===================== */
  formGroup: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  label: {
    fontSize: 13,
    color: LABEL,
    marginBottom: 6,
    fontWeight: '700',
  },

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

  /* =====================
     DROPDOWN
  ===================== */
  dropdownMenu: {
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

  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },

  dropdownItemText: {
    fontSize: 15,
    fontWeight: '500',
  },

  dropdownItemAmount: {
    fontSize: 15,
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  boldText: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
  },

  amountText: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
  },

  /* =====================
     BUTTON
  ===================== */
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 28,
    marginHorizontal: 20, 
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center', 
  },

  /* =====================
     MODALS
  ===================== */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  modalSheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },

  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },

  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  optionName: {
    fontSize: 15,
    color: TEXT,
  },

  optionAmount: {
    fontSize: 15,
    fontWeight: '600',
  },

  cancelBtn: {
    backgroundColor: '#F1F1F1',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  cancelText: {
    color: TEXT,
    fontWeight: '600',
  },

  /* =====================
     SUCCESS / ERROR
  ===================== */
  successSheet: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    alignItems: 'center',
  },

  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#D9534F',
    textAlign: 'center',
  },

  owlImage: {
    width: 110,
    height: 110,
    marginBottom: 20,
  },

  infoBox: {
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 13,
    color: LABEL,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },

  modalButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },

  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
