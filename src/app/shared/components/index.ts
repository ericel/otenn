import { SignupDialog, LoginCard } from './../../core/header/header.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { WysiwygComponent, DialogImg, DialogFont, DialogColor, DialogLink } from './/wysiwyg/wysiwyg.component';
import { ADS_COMPONENTS } from './ads-right/ads-right.component';
import { ShareComponent } from './social-share/social-share.component';
import { ColorCard } from './wysiwyg/colorcard';
import { LOADERS_COM } from './loading.component';
import { VotingComponent } from '@shared/components/voting/voting.component';

export const SHARED_COMPONENTS = [
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
    ColorCard,
    ...LOADERS_COM,
    VotingComponent
]


export const SHARED_ENTRY_COMPONENTS = [
    SignupDialog,
    DialogImg,
    DialogFont,
    DialogColor,
    DialogLink
]
