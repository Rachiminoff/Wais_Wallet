import { StyleSheet } from 'react-native';

const PRIMARY = '#0f3d3e';
const BG = '#f2f2f2';
const CARD = '#ffffff';
const TEXT_MUTED = '#6b6b6b';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: 'center',
    padding: 20,
  },

  /* ADD CARD */
  modalContainer: {
    backgroundColor: CARD,
    borderRadius: 22,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,   
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: PRIMARY,
    marginBottom: 18,
    textAlign: 'center',
  },

  modalLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 6,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 22,
    backgroundColor: '#fff',
  },

  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },

  modalCancel: {
    flex: 1,
    backgroundColor: '#e6efec',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  modalCancelText: {
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 13,
  },

  modalConfirm: {
    flex: 1,
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  modalConfirmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },

  /* ================= BOTTOM SHEET ================= */
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
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
    color: '#1f1f1f',
    marginBottom: 14,
    textAlign: 'center',
  },

  sheetMessageBox: {
    backgroundColor: '#f3f4f4',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    width: '100%',
  },

  sheetMessage: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 18,
  },

  sheetButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
  },

  sheetButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
