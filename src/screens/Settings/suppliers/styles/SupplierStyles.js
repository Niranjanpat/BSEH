import {Dimensions, StyleSheet} from 'react-native';
import { SPACINGS, TYPOGRAPHY } from '../../../../constants/theme';
import { COLORS } from '../../../../constants/theme/colors';

const size = Dimensions.get('window');
const imgSize = size.width * 0.30;

export const stylesSupplier = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
  listRight: {
    flexDirection: 'row',
    alignSelf: 'center',
  },

  //super_stockist
  containerSuperStockist: {
    flex: 1,
  },
  imgContainer: {
    borderRadius: 5,
    overflow: 'hidden',
    padding: SPACINGS.xxs,
    marginTop: SPACINGS.sm,
  },
  logo: {
    height: imgSize,
    width: imgSize,
    alignSelf: 'center',
    // tintColor: COLORS.primary,
  },
  superStockistBasicDetails: {
    alignItems: 'center',
    padding: SPACINGS.xs,
  },

  detailsContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#cfd8dc',
    width: size.width,
    padding: SPACINGS.md,
  },

  row: {
    flexDirection: 'row',
    marginBottom: SPACINGS.sm,
    flex: 1,
  },

  detailsTitle: {
    ...TYPOGRAPHY.caption,
    width: size.width * 0.22,
    color: COLORS.accentSecondary,
  },

  detailsValue: {
    flex: 1,
  },

  notAvailableTxt: {
    color: COLORS.accentPrimary,
  },

  // update screen
  updateContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: COLORS.light,
  },

  label: {
    color: COLORS.accentPrimary,
    marginBottom: 10,
  },

  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },

  errorText: {
    color: COLORS.error,
  },

  btn: {
    marginBottom: 10,
    marginTop: 20,
  },

  // current location view
  locationViewContainer: {
    flexDirection: 'row',
  },

  locationInput: {
    flex: 1,
  },

  loading: {
    position: 'absolute',
    alignSelf: 'center',
    right: '4%',
  },

  orderButton: {
    width: '40%',
    alignSelf: 'center',
    marginBottom: 10,
  },

  orderButtonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    flexWrap: 'wrap'
  },
});
