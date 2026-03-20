import { ClientError } from './ClientError';
import { NotFound } from './NotFound';
import { PermissionDenied } from './PermissionDenied';
import { ServerError } from './ServerError';

const Downgrade = {
    NotFound,
    PermissionDenied,
    ServerError,
    ClientError,
};
export default Downgrade;
