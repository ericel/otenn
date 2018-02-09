import { NotifyService } from "@shared/services/notify.service";
import { SpinnerService } from "@shared/services/spinner.service";
import { SessionService } from "@shared/services/session.service";
import { browserWindowProvider, windowProvider } from "@shared/services/windows.service";
import { UploadService } from "@shared/services/upload/upload.service";
import { AuthService } from "app/auth/state/auth.service";
import { LocationService } from "@shared/services/location.service";
import { AuthGuard } from "app/auth/state/auth.guard";


export const SHARED_SERVICES = [
    NotifyService,
    SpinnerService,
    SessionService,
    browserWindowProvider,
    windowProvider,
    UploadService,
    AuthService,
    LocationService,
    AuthGuard
];
