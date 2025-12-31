import { StyleSheet } from 'react-native';

const PRIMARY = '#183645';
const TEXT = '#1f1f1f';
const MUTED = '#6b7280';
const BORDER = '#e5e7eb';
const CARD = '#ffffff';
const SUBTLE_BG = '#f3f4f6';

export default StyleSheet.create({
  /* ================= SAFE AREA ================= */
  safeArea: {
    flex: 1,
    backgroundColor: CARD,
  },

  /* ================= HEADER ================= */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: CARD,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
  },

  divider: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: BORDER,
  },

  /* ================= FORM ================= */
  form: {
    padding: 20,
  },

  label: {
    fontSize: 12,
    marginBottom: 6,
    marginTop: 16,
    color: MUTED,
  },

  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: TEXT,
    backgroundColor: CARD,
  },

  currencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: CARD,
  },

  currency: {
    fontSize: 14,
    marginRight: 6,
    color: TEXT,
  },

  inputInner: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
    color: TEXT,
  },

  /* ================= FOOTER ================= */
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 'auto',
  },

  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: SUBTLE_BG,
  },

  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY,
  },

  createButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
    backgroundColor: PRIMARY,
  },

  createText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },

  /* ================= BOTTOM SHEET (OWL MODAL) ================= */
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: CARD,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  sheetImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
    color: TEXT,
  },

  sheetMessageBox: {
    backgroundColor: SUBTLE_BG,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    width: '100%',
  },

  sheetMessage: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    color: MUTED,
  },

  sheetButton: {
    paddingVertical: 15,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    backgroundColor: PRIMARY,
  },

  sheetButtonText: {
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.3,
    color: '#ffffff',
  },
});
