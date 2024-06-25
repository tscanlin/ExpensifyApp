import type {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import BlockingView from '@components/BlockingViews/BlockingView';
import * as Illustrations from '@components/Icon/Illustrations';
import OfflineWithFeedback from '@components/OfflineWithFeedback';
import RadioListItem from '@components/SelectionList/RadioListItem';
import type {SelectorType} from '@components/SelectionScreen';
import SelectionScreen from '@components/SelectionScreen';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ErrorUtils from '@libs/ErrorUtils';
import Navigation from '@libs/Navigation/Navigation';
import {getSageIntacctNonReimbursableActiveDefaultVendor, getSageIntacctVendors} from '@libs/PolicyUtils';
import type {SettingsNavigatorParamList} from '@navigation/types';
import variables from '@styles/variables';
import {updateSageIntacctDefaultVendor} from '@userActions/connections/SageIntacct';
import * as Policy from '@userActions/Policy/Policy';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type SCREENS from '@src/SCREENS';
import type {Connections} from '@src/types/onyx/Policy';

type SageIntacctDefaultVendorPageProps = StackScreenProps<SettingsNavigatorParamList, typeof SCREENS.WORKSPACE.ACCOUNTING.SAGE_INTACCT_DEFAULT_VENDOR>;

function SageIntacctDefaultVendorPage({route}: SageIntacctDefaultVendorPageProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();

    const policyID = route.params.policyID ?? '-1';
    const [policy] = useOnyx(`${ONYXKEYS.COLLECTION.POLICY}${policyID}`);
    const {export: exportConfig} = policy?.connections?.intacct?.config ?? {};

    const isReimbursable = route.params.reimbursable === 'reimbursable';

    let defaultVendor;
    let errorFieldName;
    if (!isReimbursable) {
        const {nonReimbursable} = policy?.connections?.intacct?.config.export ?? {};
        defaultVendor = getSageIntacctNonReimbursableActiveDefaultVendor(policy);
        errorFieldName = nonReimbursable === CONST.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.CREDIT_CARD_CHARGE ? 'nonReimbursableCreditCardChargeDefaultVendor' : 'nonReimbursableVendor';
    } else {
        const {reimbursableExpenseReportDefaultVendor} = policy?.connections?.intacct?.config.export ?? {};
        defaultVendor = reimbursableExpenseReportDefaultVendor;
        errorFieldName = 'reimbursableExpenseReportDefaultVendor';
    }

    const vendorSelectorOptions = useMemo<SelectorType[]>(() => getSageIntacctVendors(policy ?? undefined, defaultVendor), [defaultVendor, policy]);

    const listHeaderComponent = useMemo(
        () => (
            <View style={[styles.pb2, styles.ph5]}>
                <Text style={[styles.pb5, styles.textNormal]}>{translate('workspace.sageIntacct.defaultVendorDescription', isReimbursable)}</Text>
            </View>
        ),
        [translate, styles.pb2, styles.ph5, styles.pb5, styles.textNormal, isReimbursable],
    );

    const updateDefaultVendor = useCallback(
        ({value}: SelectorType) => {
            if (value !== defaultVendor) {
                let settingName: keyof Connections['intacct']['config']['export'];
                if (isReimbursable) {
                    settingName = 'reimbursableExpenseReportDefaultVendor';
                } else {
                    const {nonReimbursable} = policy?.connections?.intacct?.config.export ?? {};
                    settingName =
                        nonReimbursable === CONST.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.CREDIT_CARD_CHARGE ? 'nonReimbursableCreditCardChargeDefaultVendor' : 'nonReimbursableVendor';
                }
                updateSageIntacctDefaultVendor(policyID, settingName, value);
            }
            Navigation.goBack(ROUTES.POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES.getRoute(policyID));
        },
        [defaultVendor, policyID, isReimbursable, policy?.connections?.intacct?.config.export],
    );

    const listEmptyContent = useMemo(
        () => (
            <BlockingView
                icon={Illustrations.TeleScope}
                iconWidth={variables.emptyListIconWidth}
                iconHeight={variables.emptyListIconHeight}
                title={translate('workspace.common.noAccountsFound')}
                subtitle={translate('workspace.common.noAccountsFoundDescription', CONST.POLICY.CONNECTIONS.NAME.SAGE_INTACCT)}
                containerStyle={styles.pb10}
            />
        ),
        [translate, styles.pb10],
    );

    return (
        // TODO: add scroll here
        <OfflineWithFeedback
            errors={ErrorUtils.getLatestErrorField(exportConfig ?? {}, errorFieldName)}
            errorRowStyles={[styles.ph5, styles.mt2]}
            onClose={() => Policy.clearSageIntacctExportErrorField(policyID, errorFieldName)}
        >
            <SelectionScreen
                policyID={policyID}
                featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
                displayName={SageIntacctDefaultVendorPage.displayName}
                sections={vendorSelectorOptions.length ? [{data: vendorSelectorOptions}] : []}
                listItem={RadioListItem}
                onSelectRow={updateDefaultVendor}
                initiallyFocusedOptionKey={vendorSelectorOptions.find((mode) => mode.isSelected)?.keyForList}
                headerContent={listHeaderComponent}
                onBackButtonPress={() =>
                    Navigation.goBack(
                        isReimbursable
                            ? ROUTES.POLICY_ACCOUNTING_SAGE_INTACCT_REIMBURSABLE_EXPENSES.getRoute(policyID)
                            : ROUTES.POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES.getRoute(policyID),
                    )
                }
                title="workspace.sageIntacct.defaultVendor"
                listEmptyContent={listEmptyContent}
                connectionName={CONST.POLICY.CONNECTIONS.NAME.SAGE_INTACCT}
            />
        </OfflineWithFeedback>
    );
}

SageIntacctDefaultVendorPage.displayName = 'PolicySageIntacctDefaultVendorPage';

export default SageIntacctDefaultVendorPage;
