import { bigNum } from '@lib/bigNumber';
import { StepTypes } from '@components/Stepper/stepper-statuses';

export const CONTEXT_ID = '1hive';

export const PROPOSAL_STATUS_ACTIVE_STRING = 'Active'; // TODO: Convert to symbol
export const PROPOSAL_STATUS_CANCELLED_STRING = 'Cancelled';
export const PROPOSAL_STATUS_EXECUTED_STRING = 'Executed';
export const PROPOSAL_STATUS_CHALLENGED_STRING = 'Challenged';
export const PROPOSAL_STATUS_DISPUTED_STRING = 'Disputed';
export const PROPOSAL_STATUS_SETTLED_STRING = 'Settled';

export const PROPOSAL_STATUS_CANCELLED = 3;

export const PROPOSAL_SUPPORT_SUPPORTED = 1;
export const PROPOSAL_SUPPORT_NOT_SUPPORTED = 2;

export const PCT_BASE = bigNum(1);

export const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

export const HIVE_GARDEN_ADDRESSES = [
  '0x8ccbeab14b5ac4a431fffc39f4bec4089020a155',
  '0x7777cd7c9c6d3537244871ac8e73b3cb9710d45a',
];

export const VOTE_ABSENT = 'VOTE_ABSENT';
export const VOTE_YEA = 'VOTE_YEA';
export const VOTE_NAY = 'VOTE_NAY';

export const VOTE_STATUS_ONGOING = Symbol('VOTE_STATUS_ONGOING');
export const VOTE_STATUS_REJECTED = Symbol('VOTE_STATUS_REJECTED');
export const VOTE_STATUS_ACCEPTED = Symbol('VOTE_STATUS_ACCEPTED');
export const VOTE_STATUS_ENACTED = Symbol('VOTE_STATUS_ENACTED');
export const VOTE_STATUS_PENDING_ENACTMENT = Symbol('VOTE_STATUS_PENDING_ENACTMENT');
export const VOTE_STATUS_CANCELLED = Symbol('VOTE_STATUS_CANCELLED');
export const VOTE_STATUS_CHALLENGED = Symbol('VOTE_STATUS_CHALLENGED');
export const VOTE_STATUS_DISPUTED = Symbol('VOTE_STATUS_DISPUTED');
export const VOTE_STATUS_SETTLED = Symbol('VOTE_STATUS_SETTLED');

export const DEFAULT_CHAIN_ID = 100;

export const TERMINAL_EXECUTOR_MESSAGE = `# Available commands:

install <repo> [...initParams]
grant <entity> <app> <role> [permissionManager]
revoke <entity> <app> <role>
exec <app> <methodName> [...params]
act <agent> <targetAddr> <methodSignature> [...params]

# Example (unwrap wxDAI):

install agent:new-agent
grant voting agent:new-agent TRANSFER_ROLE voting
exec vault transfer -token:tokens.honeyswap.org:WXDAI agent:new-agent 100e18
act agent:new-agent -token:tokens.honeyswap.org:WXDAI withdraw(uint256) 100e18
exec agent:new-agent transfer -token:XDAI vault 100e18
`;

export type TransactionStatusType =
  | StepTypes.STEP_ERROR
  | StepTypes.STEP_PROMPTING
  | StepTypes.STEP_SUCCESS
  | StepTypes.STEP_WAITING
  | StepTypes.STEP_WORKING;
