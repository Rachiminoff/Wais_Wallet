import { StyleSheet } from 'react-native';

const PRIMARY = '#8FA5A3';
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

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    marginHorizontal: 16, 
    marginBottom: 24,
  },

  /* =====================
     CARDS
  ===================== */
  card: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
    marginVertical: 8, // optional: separates cards vertically
    marginHorizontal: 16, 
    backgroundColor: '#fff',
  },

  label: {
    fontSize: 13,
    color: LABEL,
    marginBottom: 6,
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
     INPUT
  ===================== */
  inputCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 8,
    marginTop: 8,
    marginHorizontal: 16, 
  },

  inputLabel: {
    fontSize: 13,
    color: LABEL,
    marginBottom: 6,
  },

  input: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
    padding: 0,
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
    marginHorizontal: 16, 
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
    justifyContent: 'flex-end',
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
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#D9534F',
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
