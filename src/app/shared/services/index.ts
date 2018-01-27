import { NotifyService } from "@shared/services/notify.service";
import { SpinnerService } from "@shared/services/spinner.service";
import { SessionService } from "@shared/services/session.service";
import { browserWindowProvider, windowProvider } from "@shared/services/windows.service";
import { UploadService } from "@shared/services/upload/upload.service";


export const SHARED_SERVICES = [
    NotifyService,
    SpinnerService,
    SessionService,
    browserWindowProvider,
    windowProvider,
    UploadService
];
