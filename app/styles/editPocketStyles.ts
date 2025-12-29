import { StyleSheet } from 'react-native';

const PRIMARY = '#0f3d3e';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY,
  },

  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#eef3f2',
  },

  columnLeft: {
    flex: 1,
    fontSize: 13,
    color: '#6c7c7c',
  },

  columnRight: {
    width: 120,
    fontSize: 13,
    color: '#6c7c7c',
    textAlign: 'right',
  },

  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },

  pocketName: {
    flex: 1,
    fontSize: 14,
  },

  amountCell: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },

  amountInput: {
    textAlign: 'right',
    minWidth: 60,
    fontSize: 14,
  },

  saveButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* MODALS */
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
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 14,
  },

  warningBox: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 10,
  },

  warningText: {
    fontSize: 13,
    color: '#444',
  },

  infoBox: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 10,
  },

  infoText: {
    fontSize: 13,
    color: '#444',
  },

  modalActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#e7eeee',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  cancelText: {
    color: PRIMARY,
    fontWeight: '600',
  },

  confirmButton: {
    flex: 1,
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
