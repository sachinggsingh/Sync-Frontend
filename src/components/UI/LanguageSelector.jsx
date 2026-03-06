import { memo } from 'react';
import { Code2 } from 'lucide-react';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', extension: '.js' },
  { value: 'typescript', label: 'TypeScript', extension: '.ts' },
  { value: 'java', label: 'Java', extension: '.java' },
  { value: 'go', label: 'Go', extension: '.go' },
];

const LanguageSelector = memo(({ selectedLanguage, onChange }) => (
  <div className="flex items-center gap-2">
    <Code2 size={16} className="text-gray-400" />
    <select
      className="
        bg-gray-700 text-white text-sm rounded-lg border border-gray-600 
        px-3 py-2 appearance-none cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        hover:bg-gray-600 transition-colors duration-200
      "
      value={selectedLanguage}
      onChange={onChange}
      title="Select programming language"
    >
      {LANGUAGES.map(({ value, label, extension }) => (
        <option key={value} value={value}>
          {label} ({extension})
        </option>
      ))}
    </select>
  </div>
));

LanguageSelector.displayName = 'LanguageSelector';
export default LanguageSelector;
