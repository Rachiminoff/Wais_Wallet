import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  helloText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000ff',
  },
  emailText: {
    fontSize: 13,
    color: '#ccc',
  },
  balanceCard: {
    backgroundColor: '#12324A',
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  safeLabel: {
    color: '#fff',
    fontSize: 14,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  addBtn: {
    backgroundColor: '#0ABAB5',
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: 20,
  },
  totalLabel: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },
  pocketsCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  pocketsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    fontSize: 15,
  },
  value: {
    fontSize: 15,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navIcon: {
    fontSize: 24,
    color: '#999',
  },
  navIconActive: {
    fontSize: 28,
    color: '#0ABAB5',
  },
});
