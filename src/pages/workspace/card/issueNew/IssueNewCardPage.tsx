import React from 'react';
import {useOnyx} from 'react-native-onyx';
import type {WithPolicyAndFullscreenLoadingProps} from '@pages/workspace/withPolicyAndFullscreenLoading';
import withPolicyAndFullscreenLoading from '@pages/workspace/withPolicyAndFullscreenLoading';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import AssigneeStep from './AssigneeStep';
import CardNameStep from './CardNameStep';
import CardTypeStep from './CardTypeStep';
import ConfirmationStep from './ConfirmationStep';
import LimitStep from './LimitStep';
import LimitTypeStep from './LimitTypeStep';

function IssueNewCardPage({policy}: WithPolicyAndFullscreenLoadingProps) {
    const [issueNewCard] = useOnyx(ONYXKEYS.ISSUE_NEW_EXPENSIFY_CARD);

    const {currentStep} = issueNewCard ?? {};

    switch (currentStep) {
        case CONST.EXPENSIFY_CARD.STEP.ASSIGNEE:
            return <AssigneeStep policy={policy} />;
        case CONST.EXPENSIFY_CARD.STEP.CARD_TYPE:
            return <CardTypeStep />;
        case CONST.EXPENSIFY_CARD.STEP.LIMIT_TYPE:
            return <LimitTypeStep />;
        case CONST.EXPENSIFY_CARD.STEP.LIMIT:
            return <LimitStep />;
        case CONST.EXPENSIFY_CARD.STEP.CARD_TITLE:
            return <CardNameStep />;
        case CONST.EXPENSIFY_CARD.STEP.CONFIRMATION:
            return <ConfirmationStep />;
        default:
            return <AssigneeStep policy={policy} />;
    }
}

IssueNewCardPage.displayName = 'IssueNewCardPage';
export default withPolicyAndFullscreenLoading(IssueNewCardPage);
