import { Wifi, WifiOff } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useStory } from '@/lib/storyStore';

// Scene 09 — local runtime vs optional cloud. Source: PMG local operation / offline behaviour, incident "retain evidence until connectivity returns".
export default function ConnectivityToggle() {
  const online = useStory((s) => s.online);
  const set = useStory((s) => s.set);
  return (
    <div className="grid gap-4">
      <ToggleGroup
        type="single"
        value={online ? 'online' : 'offline'}
        onValueChange={(v) => v && set({ online: v === 'online' })}
        aria-label="Simulate vehicle connectivity"
        className="conn-toggle"
      >
        <ToggleGroupItem value="online" aria-label="Connected">
          <Wifi aria-hidden="true" /> Connected
        </ToggleGroupItem>
        <ToggleGroupItem value="offline" aria-label="No connectivity">
          <WifiOff aria-hidden="true" /> No connectivity
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="conn-cols" aria-live="polite">
        <div>
          <p className="gen-k">In the vehicle — always</p>
          <ul className="gen-list gen-list--iface">
            <li>Module insight and PMG runtime keep their defined behaviour</li>
            <li>Recommendations stay within local permissions</li>
            <li>Outcomes are checked on the vehicle</li>
            <li>{online ? 'Authorized evidence is shared as agreed' : 'Evidence is retained until connectivity returns'}</li>
          </ul>
        </div>
        <div className={online ? '' : 'is-paused'}>
          <p className="gen-k">Optional OEM / fleet services — {online ? 'available' : 'waiting'}</p>
          <ul className="gen-list">
            <li>Quality investigations across permitted vehicles</li>
            <li>Service evidence and repeat-issue analysis</li>
            <li>Version-aware comparison of software and hardware</li>
            <li>Verification that a correction reduced recurrence</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
