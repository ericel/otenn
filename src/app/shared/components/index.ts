import { HeaderComponent, SignupDialog, LoginCard } from '@sharedcomponents/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { NotifyComponent } from '@shared/components/notify/notify.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { WysiwygComponent, DialogImg, DialogFont, DialogColor, DialogLink } from '@shared/components/wysiwyg/wysiwyg.component';
import { ADS_COMPONENTS } from '@shared/components/ads-right/ads-right.component';
import { ShareComponent } from '@shared/components/social-share/social-share.component';
import { ColorCard } from '@shared/components/wysiwyg/colorcard';

export const SHARED_COMPONENTS = [
    HeaderComponent,
    FooterComponent,
    NotifyComponent,
    SignupDialog,
    SpinnerComponent,
    LoginCard,
    WysiwygComponent,
    DialogImg,
    DialogFont,
    DialogColor,
    DialogLink,
    ADS_COMPONENTS,
    ShareComponent,
    ColorCard
]


export const SHARED_ENTRY_COMPONENTS = [
    SignupDialog,
    DialogImg,
    DialogFont,
    DialogColor,
    DialogLink
]
