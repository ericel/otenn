import { ShortenPipe } from '@pipes/shorten.pipe';
import { SlugifyPipe } from '@shared/pipes/slugify.pipe';
import { FilterPipe } from '@shared/pipes/filter.pipe';
import { Decode64Pipe } from '@shared/pipes/base64.pipe';

export const App_Pipes = [
    ShortenPipe,
    SlugifyPipe,
    FilterPipe,
    Decode64Pipe
]
