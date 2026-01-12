import { StyleSheet } from 'react-native';

const PRIMARY = '#183645';
const PRIMARY_SOFT = '#e6f0f1';
const TEXT_MAIN = '#1f2933';
const TEXT_MUTED = '#6b7280';
const BORDER = '#d9e1e5';
const CARD = '#ffffff';
const OVERLAY = 'rgba(0,0,0,0.45)';
const DANGER = '#d9534f';

export default StyleSheet.create({
  /* ================= SAFE AREA ================= */
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fbfb',
  },

  /* ================= HEADER ================= */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    justifyContent: 'space-between',
    backgroundColor: CARD,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: PRIMARY,
  },

  divider: {
    height: 1,
    backgroundColor: BORDER,
  },

  /* ================= FORM ================= */
  form: {
    padding: 20,
    gap: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT_MUTED,
    marginBottom: -4,
  },

  input: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: TEXT_MAIN,
  },

  currencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
  },

  currency: {
    marginRight: 6,
    fontSize: 14,
    color: TEXT_MAIN,
  },

  inputInner: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: TEXT_MAIN,
  },

  /* ================= FOOTER ================= */
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 14,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: PRIMARY_SOFT,
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
  },

  cancelText: {
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 14,
  },

  saveButton: {
    flex: 1,
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
  },

  saveText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },

  /* ================= BOTTOM SHEET OVERLAY ================= */
  sheetOverlay: {
    flex: 1,
    backgroundColor: OVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ================= BOTTOM SHEET ================= */
  sheet: {
    backgroundColor: CARD,
    borderRadius: 28,
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
  },

  sheetImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_MAIN,
    marginBottom: 14,
    textAlign: 'center',
  },

  sheetMessageBox: {
    backgroundColor: '#f3f6f7',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 26,
    width: '100%',
  },

  sheetMessage: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 19,
  },

  sheetButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
  },

  sheetButtonDanger: {
    backgroundColor: DANGER,
  },

  sheetButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.3,
  },

/* ================= DELETE SHEET ================= */
deleteTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: TEXT_MAIN,
  textAlign: 'center',
  marginBottom: 18,
},

deleteWarningBox: {
  backgroundColor: '#f3f4f6',
  borderRadius: 18,
  paddingVertical: 18,
  paddingHorizontal: 20,
  marginBottom: 28,
  width: '100%',
},

deleteWarningText: {
  fontSize: 14,
  color: TEXT_MAIN,
  textAlign: 'center',
  lineHeight: 22,
},

deleteHighlight: {
  color: DANGER,
  fontWeight: '700',
},

deleteActions: {
  flexDirection: 'row',
  width: '100%',
  gap: 14,                // ✅ proper spacing
},

deleteCancelButton: {
  flex: 1,
  backgroundColor: PRIMARY_SOFT,
  paddingVertical: 16,
  borderRadius: 20,       // ✅ more pill-like
  alignItems: 'center',
  justifyContent: 'center',
},

deleteCancelText: {
  color: PRIMARY,
  fontWeight: '600',
  fontSize: 15,           // ✅ matches confirm visual weight
},

deleteConfirmButton: {
  flex: 1,
  backgroundColor: PRIMARY,
  paddingVertical: 16,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
},

deleteConfirmText: {
  color: '#ffffff',
  fontWeight: '700',
  fontSize: 15,
},

});
