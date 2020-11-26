import '../utils/DayjsAdapter'; // importing overrides Chart.js' time handling to use day.js
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import 'dayjs/locale/de';

dayjs.extend(minMax);
dayjs.extend(relativeTime);
dayjs.extend(weekOfYear);
// TODO: update locale when language is changed via UI
dayjs.locale('de');

export default dayjs;
